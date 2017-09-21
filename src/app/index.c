#include <gtk/gtk.h>
#include <stdio.h>
#include "index.h"

typedef struct {
  char *title;
  char *namespace;
  int width;
  int height;
} Settings;
Settings settings = {"Some Title", "org.gtk.example", 200, 200};

typedef struct {
  GtkWidget *window;
} RenderPackage;

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

gboolean render_main(gpointer p_package) {
  RenderPackage package = *(RenderPackage*)p_package;
  gtk_widget_show_all(package.window);
  g_free((RenderPackage*)p_package);
  return G_SOURCE_REMOVE;
}
void render(GtkWidget *window) {
  RenderPackage *p_package = g_malloc(sizeof(RenderPackage));
  p_package->window = window;
  gdk_threads_add_idle(render_main, p_package);
}
