AreCongruent function
=====================

.. py:function:: AreCongruent(obj1, obj2)

   Construct a new (non-independent) GeoGebra boolean which is true or
   false according to whether the two given GeoGebra objects are
   congruent.

   If you want a snapshot of the value of this GeoGebra boolean as a
   Python ``boolean``, use code like the following:

   .. code-block:: python

      b = AreCongruent(r, s)
      print(b.value)
      # True / False


.. seealso::

   `GeoGebra AreCongruent() reference
   <https://geogebra.github.io/docs/manual/en/commands/AreCongruent/>`_
