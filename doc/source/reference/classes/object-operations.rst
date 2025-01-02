Operations between objects
==========================

Arithmetic-like operations
--------------------------

The operations of

* addition
* subtraction
* multiplication
* division
* remainder
* unary negative

are attempted within GeoGebra when at least one of the operands is a
:py:class:`Number` or :py:class:`Point` instance.  The operation might
not make sense and so might not succeed, for example in the code

.. code-block:: python

   p = Point(3, 4)
   q = p + 42

.. note::

   Future version might support operations between more classes.  For
   example, it would make sense to operate on :py:class:`Vector`
   instances.


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
