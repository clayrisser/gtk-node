#include <gtk/gtk.h>
#include <stdio.h>
#include "button.h"

typedef struct {
  char *name;
} Settings;
Settings settings = {"Some Button"};

void create(GtkWidget *window, char* label) {
  GtkWidget *button_box;
  button_box = gtk_button_box_new(GTK_ORIENTATION_HORIZONTAL);
  gtk_container_add(GTK_CONTAINER(window), button_box);
  GtkWidget *button;
  button = gtk_button_new_with_label(label);
  gtk_container_add(GTK_CONTAINER(button_box), button);
}
