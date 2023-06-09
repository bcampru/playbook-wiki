const removeImports = require("next-remove-imports")();
module.exports = removeImports({
	experimental: { esmExternals: true, appDir: true },
	reactStrictMode: true,
});
