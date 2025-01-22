Miscellaneous functions
=======================

.. py:class:: Function

   .. py:classmethod:: sin(x)

         Return a dynamic :py:class:`Number` for the sine of the given
         *x* value.

   .. py:classmethod:: cos(x)

         Return a dynamic :py:class:`Number` for the sine of the given
         *x* value.

   .. py:classmethod:: compare_LT(v, w)

         Return a dynamic :py:class:`Boolean` indicating whether the
         given *v* is less than the given *w*.

         Example:

         .. code-block:: python

            s = Slider(-4, 4)
            p = Point(s, If(Function.compare_LT(s, 0), Number(1), Number(2)))
