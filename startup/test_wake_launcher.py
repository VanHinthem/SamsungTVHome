import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import wake_launcher as launcher


class StartupTests(unittest.TestCase):
    def test_never_launch_for_initial_online(self):
        detector = launcher.WakeDetector(2, 2, 5)
        self.assertFalse(any(detector.sample(True, n) for n in range(100)))

    def test_debounce_and_one_launch_per_cycle(self):
        detector = launcher.WakeDetector(2, 2, 5)
        self.assertFalse(detector.sample(False, 0))
        self.assertFalse(detector.sample(True, 1))  # brief network glitch
        self.assertFalse(detector.sample(False, 2))
        self.assertFalse(detector.sample(False, 3))
        self.assertFalse(detector.sample(True, 4))
        self.assertFalse(detector.sample(True, 5))
        self.assertFalse(detector.sample(True, 9))
        self.assertTrue(detector.sample(True, 10))
        self.assertFalse(any(detector.sample(True, n) for n in range(11, 50)))

    def test_interrupted_settle_restarts_wait(self):
        detector = launcher.WakeDetector(2, 2, 5)
        for n in range(2):
            detector.sample(False, n)
        detector.sample(True, 2)
        detector.sample(True, 3)
        detector.sample(False, 4)
        detector.sample(True, 5)
        self.assertFalse(detector.sample(True, 6))
        self.assertFalse(detector.sample(True, 10))
        self.assertTrue(detector.sample(True, 11))

    def test_disabled_run_and_status_have_no_external_effects(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "config.json"
            config = json.loads(Path(__file__).with_name("config.example.json").read_text())
            path.write_text(json.dumps(config))
            with patch.object(launcher, "reachable") as probe, patch.object(launcher, "launch") as launch:
                self.assertEqual(launcher.main(["--config", str(path), "--run"]), 0)
                self.assertEqual(launcher.main(["--config", str(path), "--status"]), 0)
                probe.assert_not_called()
                launch.assert_not_called()

    def test_dry_run_never_launches_even_with_enabled_file(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "config.json"
            config = json.loads(Path(__file__).with_name("config.example.json").read_text())
            config["enabled"] = True
            path.write_text(json.dumps(config))
            with patch.object(launcher, "validate_target", return_value=("192.168.1.2", "tizen.bat")), \
                 patch.object(launcher, "reachable", return_value=True), \
                 patch.object(launcher.WakeDetector, "sample", return_value=True), \
                 patch.object(launcher.time, "sleep", side_effect=KeyboardInterrupt), \
                 patch.object(launcher, "launch") as launch:
                with self.assertRaises(KeyboardInterrupt):
                    launcher.main(["--config", str(path), "--dry-run"])
                launch.assert_not_called()


if __name__ == "__main__":
    unittest.main()
