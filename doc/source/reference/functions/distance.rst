Distance function
=================

.. py:function:: Distance(obj1, obj2)

   Compute the distance between the given *obj1* and the given *obj2*,
   returning the value as a (wrapped) GeoGebra :py:class:`Number`.
   Not all pairs of object types are supported.

.. note:: In previous versions of PyGgb, this function returned a
   Python ``float``.  Use the :py:attr:`Number.value` property if you
   need a snapshot of the distance as a Python ``float``.


.. seealso::

   `GeoGebra Distance() reference
   <https://geogebra.github.io/docs/manual/en/commands/Distance/>`_
