#ifndef GTK_APP_HEADER
#define GTK_APP_HEADER
GtkApplication * new_app(char *);
int run_app(GtkApplication *);
typedef void on_activate_callback(gpointer *);
void register_on_activate(on_activate_callback);
#endif
