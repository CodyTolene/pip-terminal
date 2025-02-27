async function fetchLatestUpdateLinks() {
  logMessage("📡 Fetching latest update links...");

  const upgradeUrl =
    "https://thewandcompany.com/pip-boy/upgrade/readlink.php?link=upgrade.zip";
  const releaseUrl =
    "https://thewandcompany.com/pip-boy/upgrade/readlink.php?link=release.zip";

  try {
    const upgradeResponse = await fetch(upgradeUrl);
    const upgradeFileName = await upgradeResponse.text();
    const upgradeLink = `https://thewandcompany.com/pip-boy/upgrade/${upgradeFileName.trim()}`;

    const releaseResponse = await fetch(releaseUrl);
    const releaseFileName = await releaseResponse.text();
    const releaseLink = `https://thewandcompany.com/pip-boy/upgrade/${releaseFileName.trim()}`;

    logLink("🔗 Latest Upgrade ZIP", upgradeLink);
    logLink("🔗 Latest Full Firmware ZIP", releaseLink);
  } catch (error) {
    logMessage("❌ Error fetching firmware links: " + error.message);
  }
}
