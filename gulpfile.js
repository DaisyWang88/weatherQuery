let path = require('path');
let pkg = require('./package.json');
let manifest = require('./src/manifest.json');
let gulp = require('gulp');
let header = require('gulp-header');
let less = require('gulp-less');
let cssmin = require('gulp-cssmin');
let zip = require('gulp-zip');
let del = require('del');
let babel = require('gulp-babel');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const rollupBabel = require('rollup-plugin-babel');
const rollupUglify = require('rollup-plugin-uglify');
const { minify } = require('uglify-es');

const VERSION = manifest.version
let banner = [
	'/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * @version v<%= VERSION %>',
	' * @author <%= pkg.author %>',
	' */',
	''
].join('\n');

let Asset = {
	js: 'src/{background,options,lookup}.js',
	less: 'dev/*.less',
	static: [
		'src/image/*',
		'src/*.html',
		'src/*.css',
		'src/*.json',
	],
	lib:[
		'src/lib/**',
	],
};
let Dist = 'dist/';
let Release = 'release/';

gulp.task('less', function () {
	return gulp.src(Asset.less)
		.pipe(less())
		.pipe(cssmin())
		.pipe(header(banner, {
			VERSION,
			pkg: pkg
		}))
		.pipe(gulp.dest(Dist))
});

// copy static assets
gulp.task('copy', function () {
	// 关于 base ：http://stackoverflow.com/questions/25038014/how-do-i-copy-directories-recursively-with-gulp#25038015
	return gulp
		.src(Asset.static.concat(Asset.lib ), { base: 'src/' })
		.pipe(gulp.dest(Dist));
});

gulp.task('clean', function () {
	return del([
		Dist + '**/*'
	]);
});

let zipFile = pkg.name + '-v' + VERSION + '.zip';
gulp.task('cleanZip', function () {
	return del([
		Release + zipFile
	])
})
gulp.task('zip', ['cleanZip', "default"], function () {
	return gulp.src(Dist + '**/*')
		.pipe(zip(zipFile))
		.pipe(gulp.dest(Release));
});

gulp.task('watch', ['less', 'copy'], function () {
	gulp.watch(Asset.less, ['less']);
	// gulp.watch(Asset.js, ['uglify']);
	gulp.watch(Asset.static, ['copy']);
});

const getRollupOption = ({ input, dist }) => {
	let banner = `
/**
 * ${ manifest.name } - ${ pkg.description }
 * @version v${ VERSION }
 * @author ${ pkg.author }
 */`.trim();
	return {
		read: {
			input: input,
			// sourceMap: 'inline',
			output:{
				globals: {
					// chrome: 'chrome'
				},
			},
			plugins: [
				rollupBabel({
					exclude: 'node_modules/**',
					include: 'src/**.js'
				}),
				commonjs(),
				rollupUglify({
					output:{
						preamble: banner,
					},
				}, minify),
			],
			watch: {
				chokidar: true,
				include: 'src/**'
			}
		},
		write: {
			file: dist,
			format: 'cjs',
			banner,
		}
	}
};

const compile = (opt) => {
	const config = getRollupOption(opt);

	rollup.rollup(config.read).then(bundle => {
		bundle.write(config.write);
	}, (err) => {
		console.log(err);
	}).catch(err => console.log(err));
};

const opts = [{
	input: 'src/background.js',
	dist: 'dist/background.js',
}, {
	input: 'src/options.js',
	dist: 'dist/options.js',
}];
gulp.task('rollup', function () {
	opts.forEach(compile);
});

gulp.task('rollup:w', ['rollup'], function () {
	gulp.watch('./src/**/*.js', function (event) {
		const dir = event.path;
		const entry = opts.filter(item => {
			return path.resolve(item.input) === dir;
		});
		if (entry.length) {
			console.log( entry );
			entry.forEach(compile);
		}
	});
});

gulp.task('dev', ["watch", 'rollup:w']);
gulp.task('default', ["rollup", "less", "copy"]);
gulp.task('release', ["default", "zip"]);// 生成发布到 Chrome Web Store 的 zip 文件