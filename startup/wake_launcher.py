"""Opt-in PC companion. Import and --status never contact the TV."""
import argparse
import ipaddress
import json
from pathlib import Path
import socket
import subprocess
import time

APP_ID = "STVHome001.Home"


class WakeDetector:
    """Require observed offline -> stable online; never launch on initial online."""
    def __init__(self, offline_samples=6, online_samples=3, settle_seconds=20):
        self.offline_samples = offline_samples
        self.online_samples = online_samples
        self.settle_seconds = settle_seconds
        self.off_count = 0
        self.on_count = 0
        self.armed = False
        self.ready_since = None

    def sample(self, online, now):
        if not online:
            self.off_count += 1
            self.on_count = 0
            self.ready_since = None
            if self.off_count >= self.offline_samples:
                self.armed = True
            return False
        self.off_count = 0
        self.on_count += 1
        if not self.armed or self.on_count < self.online_samples:
            return False
        if self.ready_since is None:
            self.ready_since = now
        if now - self.ready_since < self.settle_seconds:
            return False
        self.armed = False
        self.ready_since = None
        return True


def load_config(path):
    config = json.loads(Path(path).read_text(encoding="utf-8"))
    if type(config.get("enabled")) is not bool:
        raise ValueError("enabled moet expliciet true of false zijn")
    for key, low, high in (("poll_seconds", 2, 60), ("offline_samples", 2, 60),
                           ("online_samples", 2, 60), ("settle_seconds", 5, 120)):
        value = config.get(key)
        if type(value) is not int or not low <= value <= high:
            raise ValueError("Ongeldige instelling: " + key)
    return config


def validate_target(config):
    # Restrict target and batch arguments; never pass arbitrary shell text.
    address = ipaddress.IPv4Address(config["host"])
    if not address.is_private or address.is_loopback or address.is_unspecified or address.is_multicast:
        raise ValueError("Gebruik het lokale IPv4-adres van de tv")
    cli = config["tizen_cli"]
    if any(char in cli for char in '\r\n"&|<>^%!'):
        raise ValueError("Ongeldig CLI-pad")
    path = Path(cli)
    if not path.is_absolute() or path.name.lower() != "tizen.bat" or not path.is_file():
        raise ValueError("Tizen CLI niet gevonden")
    return str(address), str(path)


def reachable(host):
    try:
        with socket.create_connection((host, 26101), timeout=2):
            return True
    except OSError:
        return False


def launch(host, cli):
    # Fixed app identity. No install, keypress, Home routing or settings commands.
    result = subprocess.run(
        [cli, "run", "-s", host + ":26101", "-p", APP_ID],
        capture_output=True, text=True, timeout=30, shell=False)
    if result.returncode:
        raise RuntimeError("Tizen startopdracht mislukt; geen automatische herhaling")
    print("Startopdracht verzonden; zichtbaar resultaat nog te controleren.", flush=True)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", default=".local/startup.json")
    action = parser.add_mutually_exclusive_group()
    action.add_argument("--status", action="store_true")
    action.add_argument("--dry-run", action="store_true")
    action.add_argument("--run", action="store_true")
    args = parser.parse_args(argv)
    config = load_config(args.config)
    print("Automatisch starten: " + ("ingeschakeld" if config["enabled"] else "uitgeschakeld"))
    if args.status or not (args.run or args.dry_run):
        return 0
    # An enabled file AND --run are required for any app launch.
    if args.run and not config["enabled"]:
        print("Geen actie: configuratie is uitgeschakeld.")
        return 0
    host, cli = validate_target(config)
    detector = WakeDetector(config["offline_samples"], config["online_samples"], config["settle_seconds"])
    print("Alleen observeren." if args.dry_run else "Actief; wacht eerst op een uit/aan-overgang.", flush=True)
    while True:
        if detector.sample(reachable(host), time.monotonic()):
            if args.dry_run:
                print("Overgang gezien; proefmodus opent geen app.", flush=True)
            else:
                launch(host, cli)
        time.sleep(config["poll_seconds"])


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("Gestopt.")
    except (ValueError, OSError, RuntimeError, subprocess.TimeoutExpired) as error:
        raise SystemExit(str(error))
