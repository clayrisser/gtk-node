#include <gtk/gtk.h>
#include <stdio.h>
#include "window.h"

void render(GtkApplication *app, gpointer *user_data, char *title, int height, int width) {
  GtkWidget *window;
  window = gtk_application_window_new(app);
  gtk_window_set_title(GTK_WINDOW(window), title);
  gtk_window_set_default_size(GTK_WINDOW(window), height, width);
  gtk_widget_show_all(window);
}
