#include <gtk/gtk.h>
#include <stdio.h>
#include "index.h"

GtkWidget *create(void) {
  GtkWidget *window;
  window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
  return window;
}
