#ifndef GTK_BUTTON_HEADER
#define GTK_BUTTON_HEADER

GtkWidget *create(char*, gboolean);

typedef void on_activate_cb();
void register_on_activate(on_activate_cb);

typedef void on_clicked_cb();
void register_on_clicked(on_clicked_cb);

typedef void on_enter_cb();
void register_on_enter(on_enter_cb);

typedef void on_leave_cb();
void register_on_leave(on_leave_cb);

typedef void on_pressed_cb();
void register_on_pressed(on_pressed_cb);

typedef void on_released_cb();
void register_on_released(on_released_cb);

void attach(GtkWidget*, GtkWidget*);

#endif
