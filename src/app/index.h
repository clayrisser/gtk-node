#ifndef GTK_APP_HEADER
#define GTK_APP_HEADER

GtkApplication *create(char*, char*);
int init(GtkApplication*);
typedef void on_activate_cb(GtkWidget*);
void register_on_activate(on_activate_cb);
void render(GtkWidget*);

#endif
