#ifndef GTK_APP_HEADER
#define GTK_APP_HEADER
GtkApplication *create(char*);
int run(GtkApplication*);
void show(GtkWidget*);
typedef void on_activate_callback(gpointer*, GtkWidget*);
void register_on_activate(on_activate_callback);
#endif
