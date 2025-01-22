If
==

.. py:function:: If(condition, then_value)

   If the given *condition* (which should be a Python :py:type:`bool`
   or a PyGgb :py:class:`Boolean`, perhaps from a comparison) is true,
   return the given *then_value*; otherwise, return the undefined
   value.

.. py:function:: If(condition, then_value, else_value)
   :noindex:

   If the given *condition* is true, return the given *then_value*;
   otherwise, return the given *else_value*.

   See the example in the description of
   :py:meth:`Function.compare_LT`.

.. py:function:: If(condition_1, then_1_value, condition_2_value, then_2_value, ..., [else_value])
   :noindex:

   If the given *condition_1* is true, return the given
   *then_1_value*; otherwise, if the given *condition_2* is true,
   return the given *then_2_value*; etc.  If none of the given
   *condition_N* is true, return the given *else_value* if present,
   otherwise the undefined value.


.. seealso::

   `GeoGebra If() reference
   <https://geogebra.github.io/docs/manual/en/commands/If/>`_
