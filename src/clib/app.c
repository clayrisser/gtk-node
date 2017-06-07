#include <gtk/gtk.h>
#include <stdio.h>
#include "app.h"

typedef struct {
  char *title;
} Settings;
Settings settings = {"Missing Title"};

GtkApplication * new_app(char *title) {
  GtkApplication *app;
  app = gtk_application_new("org.gtk.example", G_APPLICATION_FLAGS_NONE);
  settings.title = title;
  return app;
}

void (*on_activate)(gpointer *);

void register_on_activate(void (*on_activate_callback)(gpointer *)) {
  on_activate = on_activate_callback;
}

void activate(GtkApplication* app, gpointer user_data) {
  on_activate(user_data);
}

int run_app(GtkApplication *app) {
  g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
  int status = g_application_run(G_APPLICATION(app), 0, NULL);
  g_object_unref(app);
  return status;
}
