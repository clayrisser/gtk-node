import App, { Button } from '../../lib';

const app = new App({
  title: 'Node Gtk3'
});

app.run().then((app) => {
  console.log('yay');
  const button = new Button({
    parent: app.window,
    name: 'Hello, world'
  });
}).catch((err) => {
  console.error(err);
});
