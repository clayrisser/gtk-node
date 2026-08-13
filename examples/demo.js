import { App, Button } from '../src/index.js';

const app = new App({
  title: 'Node Gtk',
  namespace: 'org.gtk.example',
  width: 200,
  height: 200,
});

const window = await app.init();

const button = new Button({
  label: 'Button 1',
  opacity: 0.9,
  height: 100,
  width: 50,
});
for (const signal of ['Activate', 'Clicked', 'Enter', 'Leave', 'Pressed', 'Released']) {
  button[`on${signal}`] = () => console.log(`button ${signal.toLowerCase()}`);
}
button.attach(window);
app.render();
