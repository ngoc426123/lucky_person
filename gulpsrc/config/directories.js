// DIRECTORIES SOURCE
const src = `./src`;
const src_html = `/html/*.pug`;
const src_style = `/scss/app.scss`;
const src_script = `/js/all.js`;
const src_data = `/data/*`;
const src_images = `/images/**`;
const src_fonts = [`node_modules/@fortawesome/fontawesome-free/webfonts/*`, `${src}/fonts/**`];

// DIRECTORIES BUILD
const build = `./build`;
const build_html = ``;
const build_style = `/css`;
const build_script = `/js`;
const build_data = `/data`;
const build_images = `/images`;
const build_fonts = `/fonts`;

// MODULE EXPORT
exports.src = src;
exports.src_html = src + src_html;
exports.src_style = src + src_style;
exports.src_script = src + src_script;
exports.src_data = src + src_data;
exports.src_images = src + src_images;
exports.src_fonts = src_fonts;

exports.build = build;
exports.build_html = build + build_html;
exports.build_style = build + build_style;
exports.build_script = build + build_script;
exports.build_data = build + build_data;
exports.build_images = build + build_images;
exports.build_fonts = build + build_fonts;