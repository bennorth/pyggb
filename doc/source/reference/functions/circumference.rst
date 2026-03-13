Circumference function
======================

.. py:function:: Circumference(ellipse)

   Construct a new (non-independent) dynamic GeoGebra number which is
   the circumference of the given *ellipse* (which might be a circle).

   If you want a snapshot of the circumference as a Python ``float``,
   you can use code like the following:

   .. code-block:: python

      k = Circle(3, 4, 2)
      print(Circumference(k).value)
      # 12.56⋯


.. seealso::

   `GeoGebra Circumference() reference
   <https://geogebra.github.io/docs/manual/en/commands/Circumference/>`_
