import { App, Button } from '../../lib';

const app = new App({
  title: 'Node Gtk'
});
app.init((window) => {
  const button = new Button({
    name: 'Button 1'
  });
  button.attach(window);
  app.render();
});
