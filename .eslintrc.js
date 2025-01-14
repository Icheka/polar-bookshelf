/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint.
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "prettier",
        // "prettier/@typescript-eslint",
        "plugin:react-hooks/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "eslint-plugin-jsdoc",
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-import",
        "@typescript-eslint"
    ],
    "rules": {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        "curly": "error",
        "brace-style": "error",

        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        // "@typescript-eslint/no-non-null-assertion": "error",

        "import/newline-after-import": "error",
        "import/no-cycle": "error",
        "import/no-absolute-path": "error",

        // "import/order": "error",


        // this isn't working yet because it does not seem to properly
        // handle method call parameters..
        // "indent": ["error", 4, {
        //     "FunctionDeclaration": {
        //         "parameters": "off"
        //     },
        //     "FunctionExpression": {
        //         "parameters": "off"
        //     },
        //     "SwitchCase": 1,e
        //     "MemberExpression": "off"
        // }
        //
        // ]
        // "@typescript-eslint/adjacent-overload-signatures": "error",
        // "@typescript-eslint/array-type": [
        //     "error",
        //     {
        //         "default": "array"
        //     }
        // ],
        // "@typescript-eslint/await-thenable": "error",
        // "@typescript-eslint/ban-types": [
        //     "error",
        //     {
        //         "types": {
        //             "Object": {
        //                 "message": "Avoid using the `Object` type. Did you mean `object`?"
        //             },
        //             "Function": {
        //                 "message": "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
        //             },
        //             "Boolean": {
        //                 "message": "Avoid using the `Boolean` type. Did you mean `boolean`?"
        //             },
        //             "Number": {
        //                 "message": "Avoid using the `Number` type. Did you mean `number`?"
        //             },
        //             "String": {
        //                 "message": "Avoid using the `String` type. Did you mean `string`?"
        //             },
        //             "Symbol": {
        //                 "message": "Avoid using the `Symbol` type. Did you mean `symbol`?"
        //             }
        //         }
        //     }
        // ],
        // "@typescript-eslint/consistent-type-assertions": "off",
        // "@typescript-eslint/dot-notation": "error",
        // "@typescript-eslint/member-ordering": "off",
        // "@typescript-eslint/naming-convention": "error",
        // "@typescript-eslint/no-empty-function": "error",
        // "@typescript-eslint/no-empty-interface": "off",
        // "@typescript-eslint/no-explicit-any": "off",
        // "@typescript-eslint/no-misused-new": "error",
        // "@typescript-eslint/no-namespace": "off",
        // "@typescript-eslint/no-parameter-properties": "off",
        // "@typescript-eslint/no-unused-expressions": "error",
        // "@typescript-eslint/no-unused-vars": "error",
        // "@typescript-eslint/no-use-before-define": "off",
        // "@typescript-eslint/no-var-requires": "off",
        // "@typescript-eslint/prefer-for-of": "error",
        // "@typescript-eslint/prefer-function-type": "error",
        // "@typescript-eslint/prefer-namespace-keyword": "error",
        // "@typescript-eslint/quotes": "off",
        // "@typescript-eslint/triple-slash-reference": [
        //     "error",
        //     {
        //         "path": "always",
        //         "types": "prefer-import",
        //         "lib": "always"
        //     }
        // ],
        // "@typescript-eslint/unified-signatures": "error",
        // "arrow-parens": [
        //     "off",
        //     "always"
        // ],
        // "comma-dangle": "off",
        // "complexity": "off",
        // "constructor-super": "error",
        // "eqeqeq": [
        //     "error",
        //     "smart"
        // ],
        // "guard-for-in": "error",
        // "id-blacklist": [
        //     "error",
        //     "any",
        //     "Number",
        //     "number",
        //     "String",
        //     "string",
        //     "Boolean",
        //     "boolean",
        //     "Undefined",
        //     "undefined"
        // ],
        // "id-match": "error",
        // "import/order": "off",
        // "jsdoc/check-alignment": "error",
        // "jsdoc/check-indentation": "error",
        // "jsdoc/newline-after-description": "error",
        // "max-classes-per-file": "off",
        // "max-len": "off",
        // "new-parens": "error",
        // "no-bitwise": "error",
        // "no-caller": "error",
        // "no-cond-assign": "error",
        // "no-console": [
        //     "off",
        //     {
        //         "allow": [
        //             "warn",
        //             "dir",
        //             "timeLog",
        //             "assert",
        //             "clear",
        //             "count",
        //             "countReset",
        //             "group",
        //             "groupEnd",
        //             "table",
        //             "dirxml",
        //             "error",
        //             "groupCollapsed",
        //             "Console",
        //             "profile",
        //             "profileEnd",
        //             "timeStamp",
        //             "context"
        //         ]
        //     }
        // ],
        // "no-debugger": "error",
        // "no-empty": "error",
        // "no-eval": "error",
        // "no-fallthrough": "off",
        // "no-invalid-this": "off",
        // "no-multiple-empty-lines": "off",
        // "no-new-wrappers": "error",
        // "no-shadow": [
        //     "off",
        //     {
        //         "hoist": "all"
        //     }
        // ],
        // "no-throw-literal": "error",
        // "no-trailing-spaces": "off",
        // "no-undef-init": "error",
        // "no-underscore-dangle": "error",
        // "no-unsafe-finally": "error",
        // "no-unused-labels": "error",
        // "no-var": "error",
        // "object-shorthand": "error",
        // "one-var": [
        //     "error",
        //     "never"
        // ],
        // "prefer-arrow/prefer-arrow-functions": "off",
        // "prefer-const": "error",
        // "quote-props": "off",
        // "radix": "off",
        // "space-before-function-paren": "off",
        // "spaced-comment": [
        //     "error",
        //     "always",
        //     {
        //         "markers": [
        //             "/"
        //         ]
        //     }
        // ],
        // "use-isnan": "error",
        // "valid-typeof": "off"
    }
};
