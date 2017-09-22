{
  "targets": [
    {
      "target_name": "app",
      "type": "shared_library",
      "cflags": [
        "`pkg-config --cflags --libs gtk+-3.0`"
      ],
      "ldflags": [
        "`pkg-config --cflags --libs gtk+-3.0`"
      ],
      "sources": [
        "./src/app/index.c"
      ],
      "product_extension": "so"
    },
    {
      "target_name": "button",
      "type": "shared_library",
      "cflags": [
        "`pkg-config --cflags --libs gtk+-3.0`"
      ],
      "ldflags": [
        "`pkg-config --cflags --libs gtk+-3.0`"
      ],
      "sources": [
        "./src/button/index.c"
      ],
      "product_extension": "so"
    },
    {
      "target_name": "window",
      "type": "shared_library",
      "cflags": [
        "`pkg-config --cflags --libs gtk+-3.0`"
      ],
      "ldflags": [
        "`pkg-config --cflags --libs gtk+-3.0`"
      ],
      "sources": [
        "./src/window/index.c"
      ],
      "product_extension": "so"
    }
  ]
}
