#ifndef GTK_APP_HEADER
#define GTK_APP_HEADER

#include <gtk/gtk.h>

GtkApplication *create(char*, char*, int, int);
int init(GtkApplication*);
typedef void on_activate_cb(GtkWidget*);
void register_on_activate(on_activate_cb);
void render(GtkWidget*);

#endif
