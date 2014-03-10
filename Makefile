watch:
	watchify --global-transform brfs -o demo/bundle.js demo/hk.js

stats:
	cloc --force-lang=css,unwise lib index.js

