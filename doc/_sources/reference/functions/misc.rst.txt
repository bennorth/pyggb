Miscellaneous functions
=======================

.. py:class:: Function

   .. py:classmethod:: sin(x)

      Return a dynamic :py:class:`Number` for the sine of the given
      *x* value.

   .. py:classmethod:: cos(x)

      Return a dynamic :py:class:`Number` for the cosine of the given
      *x* value.

   .. py:classmethod:: log(b, x)

      Return a dynamic :py:class:`Number` for the logarithm of the
      given *x* value to the base *b*.

   .. py:classmethod:: ln(x)

      Return a dynamic :py:class:`Number` for the natural logarithm of
      the given *x* value, i.e., the logarithm to the base *e*.

   .. py:classmethod:: log10(x)

      Return a dynamic :py:class:`Number` for the logarithm of the
      given *x* value to the base 10.

   .. py:classmethod:: log2(x)

      Return a dynamic :py:class:`Number` for the logarithm of the
      given *x* value to the base 2.

   .. py:classmethod:: compare_LT(v, w)

      Return a dynamic :py:class:`Boolean` indicating whether the
      given *v* is less than the given *w*.

      Example:

      .. code-block:: python

         s = Slider(-4, 4)
         p = Point(s, If(Function.compare_LT(s, 0), Number(1), Number(2)))
