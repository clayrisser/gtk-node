#include <gtk/gtk.h>
#include <stdio.h>
#include "index.h"

typedef struct {
  GtkWidget *button;
  GtkWidget *container;
} AttachPackage;

GtkWidget *create(char* label, gboolean mnemonic) {
  GtkWidget *button;
  if (mnemonic) {
    button = gtk_button_new_with_mnemonic(label);
  } else {
    button = gtk_button_new_with_label(label);
  }
  return button;
}

void (*on_activate)();
void register_on_activate(void (*on_activate_cb)()) {
  on_activate = on_activate_cb;
}

void (*on_clicked)();
void register_on_clicked(void (*on_clicked_cb)()) {
  on_clicked = on_clicked_cb;
}

void (*on_enter)();
void register_on_enter(void (*on_enter_cb)()) {
  on_enter = on_enter_cb;
}

void (*on_leave)();
void register_on_leave(void (*on_leave_cb)()) {
  on_leave = on_leave_cb;
}

void (*on_pressed)();
void register_on_pressed(void (*on_pressed_cb)()) {
  on_pressed = on_pressed_cb;
}

void (*on_released)();
void register_on_released(void (*on_released_cb)()) {
  on_released = on_released_cb;
}

gboolean attach_main(gpointer p_package) {
  AttachPackage package = *(AttachPackage*)p_package;
  g_signal_connect(package.button, "activate", G_CALLBACK(on_activate), NULL);
  g_signal_connect(package.button, "clicked", G_CALLBACK(on_clicked), NULL);
  g_signal_connect(package.button, "enter", G_CALLBACK(on_enter), NULL);
  g_signal_connect(package.button, "leave", G_CALLBACK(on_leave), NULL);
  g_signal_connect(package.button, "pressed", G_CALLBACK(on_pressed), NULL);
  g_signal_connect(package.button, "released", G_CALLBACK(on_released), NULL);
  GtkWidget *button_box;
  button_box = gtk_button_box_new(GTK_ORIENTATION_HORIZONTAL);
  gtk_container_add(GTK_CONTAINER(package.container), button_box);
  gtk_container_add(GTK_CONTAINER(button_box), package.button);
  gtk_widget_show_all(button_box);
  g_free((AttachPackage*)p_package);
  return G_SOURCE_REMOVE;
}
void attach(GtkWidget *button, GtkWidget *container) {
  AttachPackage *p_package = g_malloc(sizeof(AttachPackage));
  p_package->button = button;
  p_package->container = container;
  gdk_threads_add_idle(attach_main, p_package);
}
