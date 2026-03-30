AreEqual function
=================

.. py:function:: AreEqual(obj1, obj2)

   Construct a new (non-independent) GeoGebra boolean which is true or
   false according to whether the two given GeoGebra objects are
   equal.

   If you want a snapshot of the value of this GeoGebra boolean as a
   Python ``boolean``, use code like the following:

   .. code-block:: python

      b = AreEqual(r, s)
      print(b.value)
      # True / False


.. seealso::

   `GeoGebra AreEqual() reference
   <https://geogebra.github.io/docs/manual/en/commands/AreEqual/>`_
