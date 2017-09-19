#include <gtk/gtk.h>
#include <stdio.h>
#include "index.h"

typedef struct {
  char *name;
} Settings;
Settings settings = {"Some Button"};

typedef struct {
  GtkWidget *button;
  GtkWidget *container;
} AttachPackage;

GtkWidget *create(char* label) {
  GtkWidget *button;
  button = gtk_button_new_with_label(label);
  return button;
}

void (*on_click)();
void register_on_click(void (*on_click_cb)()) {
  on_click = on_click_cb;
}

gboolean attach_main(gpointer p_package) {
  AttachPackage package = *(AttachPackage*)p_package;
  g_signal_connect(package.button, "clicked", G_CALLBACK(on_click), NULL);
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
