{
    "compilerOptions": {
        // ... suas compilerOptions configuradas anteriormente
        "types": ["vite/client"]
    },
    "include": [
        "src/**/*",
        "src/vite-env.d.ts"
    ],
        "references": [{ "path": "./tsconfig.node.json" }]
}
