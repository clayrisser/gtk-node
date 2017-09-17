#ifndef GTK_BUTTON_HEADER
#define GTK_BUTTON_HEADER

GtkWidget *create(char*);
typedef void on_click_cb();
void register_on_click(on_click_cb);
void attach(GtkWidget*, GtkWidget*);

#endif
