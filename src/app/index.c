#include <gtk/gtk.h>
#include <stdio.h>
#include <unistd.h>
#include "index.h"

typedef struct {
  char *title;
  char *namespace;
  int width;
  int height;
} Settings;
Settings settings = {"Some Title", "org.gtk.example"};

GtkApplication *create(char *title, char *namespace, int width, int height) {
  settings.title = title;
  settings.namespace = namespace;
  settings.width = width;
  settings.height = height;
  GtkApplication *app;
  app = gtk_application_new(namespace, G_APPLICATION_FLAGS_NONE);
  return app;
}

void (*on_activate)(GtkWidget*);
void register_on_activate(void (*on_activate_cb)(GtkWidget*)) {
  on_activate = on_activate_cb;
}

void activate(GtkApplication *app, gpointer user_data) {
  GtkWidget *window;
  window = gtk_application_window_new(app);
  gtk_window_set_title(GTK_WINDOW(window), settings.title);
  gtk_window_set_default_size(GTK_WINDOW(window), settings.width, settings.height);
  on_activate(window);
}

int init(GtkApplication *app) {
  g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
  int status = g_application_run(G_APPLICATION(app), 0, NULL);
  g_object_unref(app);
  return status;
}

void render(GtkWidget *window) {
  gtk_widget_show_all(window);
}
