.. _operations-between-objects:

Operations between objects
==========================

Arithmetic-like operations
--------------------------

The operations of

* addition (``+``)
* subtraction (``-``)
* multiplication (``*``)
* division (``/``)
* remainder (``%``)
* exponentiation (``**``)
* unary negative (``-``)

are attempted within GeoGebra when both operands are GeoGebra objects
(of certain types) or Python numbers, including the case of one
GeoGebra object and one Python number.  The operation might not make
sense and so might not succeed, for example in the code

.. code-block:: python

   p = Point(3, 4)
   q = Point(7, 8)
   s = Line(p, q) + 42

.. note::

   Future version might support operations between more classes.


Comparisons
-----------

The following comparisons between :py:class:`Number` instances give a
Python :py:type:`bool` result, based on the value of the
:py:class:`Number`\ s at the moment the comparison is made.

* :code:`==`
* :code:`!=`
* :code:`<`
* :code:`<=`
* :code:`>`
* :code:`>=`

If you need a dynamic :py:class:`Boolean` result, see
:py:class:`Function` (although note that this is experimental and only
some operations are supported).
