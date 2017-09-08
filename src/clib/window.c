#include <gtk/gtk.h>
#include <stdio.h>
#include "window.h"

GtkWidget *create() {
  GtkWidget *window;
  window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
  return window;
}
