# node-gtk3

[![Gitter](https://img.shields.io/gitter/room/react-gtk/lobby.svg?style=flat-square)](https://gitter.im/react-gtk)

Node bindings for Gtk3

Existing bindings are either abandoned or require custom runtime environments. This is an attempt to create support gtk bindings for the official node engine. This project is the foundation for [react-gtk](https://github.com/jamrizzi/react-gtk). Contributors are wanted and welcomed.

This project is using [ffi](https://github.com/node-ffi/node-ffi) to bind node to the gtk C libraries. Bindings will follow the same api implementatin as [GJS](https://wiki.gnome.org/Projects/Gjs).

Please &#9733; this repo if you found it useful &#9733; &#9733; &#9733;


## Features

* Supports official node engine


## Usage

```sh
git clone https://github.com/jamrizzi/node-gtk3.git && cd node-gtk3
npm install
make demo
```


# Dependancies

* [GTK3](https://developer.gnome.org/gtk3/)
* [NodeJS](https://nodejs.org)


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

[MIT License](https://github.com/jamrizzi/node-gtk3/blob/master/LICENSE)

[Jam Risser](https://jamrizzi.com) &copy; 2017


## Credits

* [Jam Risser](https://jamrizzi.com) - Author
* [Everton Ribeiro](https://github.com/nuxlli) - Contributor


## Changelog

0.0.2 (2017-09-06)
* Added MacOS support
* Refactored build system with [nwb](https://github.com/insin/nwb)

0.0.1 (2017-06-07)
* Initial release
