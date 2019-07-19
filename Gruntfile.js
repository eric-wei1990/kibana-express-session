module.exports = function (grunt) {
	const packageJson = require('./package.json');

	var deps = Object.keys(packageJson.dependencies || {});

	var files = [
		`${packageJson.name}.js`,
		'LICENSE',
		'package.json',
		'README.md',
	];

	deps.forEach(function (dep) {
		files.push(`node_modules/${dep}/**/*`);
	});

	grunt.initConfig({
		compress: {
			build: {
				options: {
					archive: `build/${packageJson.name}-${packageJson.version}.zip`
				},
				src: files,
				// The directory name within the archive.
				dest: packageJson.name
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('build', ['compress']);
	grunt.registerTask('default', ['build']);
};
