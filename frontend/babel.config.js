module.exports = {
    presets: [
        "@babel/preset-react", [
            "@babel/preset-env",
            {
                modules: false,
            },
        ],
        "@babel/preset-typescript",
    ],
    plugins: [
        [
            "@babel/plugin-transform-typescript",
            {
                allowNamespaces: true,
            },
        ],
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-class-properties",
    ],
};