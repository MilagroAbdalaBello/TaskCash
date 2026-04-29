from django.contrib import admin
from .models import Movimiento

@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'concepto', 'monto', 'tipo') # Esto hace que se vea lindo como una lista
    list_filter = ('tipo', 'fecha') # Agrega filtros a la derecha



