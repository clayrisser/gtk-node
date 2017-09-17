#include <gtk/gtk.h>
#include <stdio.h>
#include "index.h"

typedef struct {
  char *name;
} Settings;
Settings settings = {"Some Button"};

GtkWidget *create(char* label) {
  GtkWidget *button;
  button = gtk_button_new_with_label(label);
  return button;
}

void (*on_click)();
void register_on_click(void (*on_click_cb)()) {
  on_click = on_click_cb;
}

void attach(GtkWidget *button, GtkWidget *container) {
  g_signal_connect(button, "clicked", G_CALLBACK(on_click), NULL);
  GtkWidget *button_box;
  button_box = gtk_button_box_new(GTK_ORIENTATION_HORIZONTAL);
  gtk_container_add(GTK_CONTAINER(container), button_box);
  gtk_container_add(GTK_CONTAINER(button_box), button);
}
