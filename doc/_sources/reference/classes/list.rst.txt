List
====

.. py:class:: List

   .. py:method:: List()

      Construct a new empty :py:class:`List`.

   .. py:method:: List(elements: iterable)
      :noindex:

      Construct a new :py:class:`List` with the given *elements*,
      which must contain only wrapped GeoGebra objects.

   Instances of :py:class:`List` support ``len()`` (which gives the
   number of elements as a Python integer) and (zero-based) indexing.
   However, the semantics of indexing are as follows.  Extracting a
   particular element of a :py:class:`List` by indexing gives a
   wrapped *copy* of the element of the list, rather than a reference
   to the self-same object in the :py:class:`List`.
