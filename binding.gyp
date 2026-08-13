{
  "target_defaults": {
    "cflags": ["<!@(pkg-config --cflags gtk+-3.0)"],
    "libraries": ["<!@(pkg-config --libs gtk+-3.0)"]
  },
  "targets": [
    {
      "target_name": "app",
      "sources": ["./src/app/index.c"],
      # These two cannot be hoisted into target_defaults: node-gyp's addon.gypi
      # declares its own target_defaults with loadable_module/.node, and it is
      # included last, so only per-target keys win. These are plain C libraries
      # loaded over FFI, not V8 addons, hence shared_library and .so.
      "type": "shared_library",
      "product_extension": "so"
    },
    {
      "target_name": "button",
      "sources": ["./src/button/index.c"],
      "type": "shared_library",
      "product_extension": "so"
    },
    {
      "target_name": "window",
      "sources": ["./src/window/index.c"],
      "type": "shared_library",
      "product_extension": "so"
    }
  ]
}
