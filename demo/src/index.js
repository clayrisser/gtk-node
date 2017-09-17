import { App, Button } from '../../lib';

const app = new App({
  title: 'Node Gtk',
  namespace: 'org.gtk.example',
  width: 200,
  height:  200
});

app.init().then((window) => {
  const button = new Button({
    name: 'Button 1'
  });
  button.onClick = () => {
    console.log('Button was clicked');
  };
  button.attach(window);
  app.render();
});
