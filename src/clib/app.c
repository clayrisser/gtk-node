#include <gtk/gtk.h>
#include <stdio.h>
#include "app.h"

typedef struct {
  char *title;
} Settings;
Settings settings = {"Some Title"};

GtkApplication *create(char *title) {
  GtkApplication *app;
  app = gtk_application_new("org.gtk.example", G_APPLICATION_FLAGS_NONE);
  settings.title = title;
  return app;
}

void (*on_activate)(gpointer*, GtkWidget*);

void register_on_activate(void (*on_activate_callback)(gpointer*, GtkWidget*)) {
  on_activate = on_activate_callback;
}

void activate(GtkApplication *app, gpointer user_data) {
  GtkWidget *window;
  window = gtk_application_window_new(app);
  gtk_window_set_title (GTK_WINDOW (window), "Window");
  gtk_window_set_default_size (GTK_WINDOW (window), 200, 200);
  on_activate(user_data, window);
}

int run(GtkApplication *app) {
  g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
  int status = g_application_run(G_APPLICATION(app), 0, NULL);
  g_object_unref(app);
  return status;
}

void show(GtkWidget* window) {
  printf("hi");
  gtk_widget_show_all(window);
}
