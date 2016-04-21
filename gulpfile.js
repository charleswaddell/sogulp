'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var vendor_symlinks = require('./lib/vendor-symlinks');
var package_symlinks = require('./lib/package-symlinks');
var concentrate = require('./lib/concentrate');
var paths = require('./lib/paths');
var flags = require('./lib/flags');
var clean = require('./lib/clean');
var phplint = require('./lib/phplint');
var less = require('./lib/less');

gulp.task('phplint', phplint.task);
gulp.task('setup-vendor-symlinks', vendor_symlinks.task.setup);
gulp.task('teardown-vendor-symlinks', vendor_symlinks.task.teardown);
gulp.task('setup-package-symlinks', package_symlinks.task.setup);
gulp.task('teardown-package-symlinks', package_symlinks.task.teardown);
gulp.task('clean', [ 'teardown-symlinks' ], clean.task);
gulp.task('concentrate-internal', [ 'setup-symlinks' ], concentrate.task);
gulp.task('concentrate', [ 'concentrate-internal' ], function() {
	return package_symlinks.task.teardown();
});
gulp.task('build-less', [ 'write-flag' ], less.task);
gulp.task('write-flag', flags.task);

function cleanShutdown() {
	gutil.log(gutil.colors.blue('BYE'));

	flags.remove();
	vendor_symlinks.task.teardown();
	package_symlinks.task.teardown();

	process.exit();
}

/**
 * Watches LESS and JS files for changes and recompiles/minifies/bundles
 * them.
 */
gulp.task('watch', [ 'setup-package-symlinks', 'setup-vendor-symlinks' ], function () {
	process.on('SIGINT', cleanShutdown);
	process.on('SIGHUP', cleanShutdown);
	process.on('SIGTERM', cleanShutdown);

	gulp.watch(paths.less, [ 'build-less' ]);
	gulp.watch(paths.php, [ 'phplint' ]);
});

gulp.task('default', [ 'build-less', 'phplint', 'watch' ]);
