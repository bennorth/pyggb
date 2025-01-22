Python and GeoGebra objects
===========================

When code such as

.. code-block:: python

   p1 = Point(3, 4)
   p1.size = 8

runs, the first line of code causes two objects to be created:

a GeoGebra :code:`Point`
   is created within GeoGebra and added to the GeoGebra construction,
   and

a Python :py:class:`Point`
   is created on the Python side to refer to that GeoGebra
   :code:`Point`; the Python variable :code:`p1` refers to this Python
   object.

The second line of code then sets the :code:`size` property of the
Python :py:class:`Point` object referred to by :code:`p1`.
Internally, this then sets the size of the underlying GeoGebra
:code:`Point`.

In this way, the Python :py:class:`Point` objects acts as a wrapper
around the GeoGebra :code:`Point` object.


Constructors
------------

In general, constructors for wrapper classes are the same as the ways
you can call the corresponding GeoGebra command.  For example, the
different ways to construct a :py:class:`Ellipse` correspond to the
different ways you can use the `GeoGebra Ellipse() command
<https://geogebra.github.io/docs/manual/en/commands/Ellipse/>`_.


Object lifetimes and accessibility
----------------------------------

Currently, GeoGebra objects cannot be deleted from the construction,
although they can be hidden, by setting their :code:`is_visible`
property to :code:`False`.

The Python wrapper objects, however, can become inaccessible (and so
effectively no longer exist) if no references to them remain.  For
example, the code

.. code-block:: python

   p1 = Point(3, 4)
   Point(5, 6)

creates two GeoGebra :code:`Point` objects, each with a wrapper Python
:py:class:`Point` object.  However, the Python :py:class:`Point`
wrapping the GeoGebra :code:`Point` at *(5, 6)* has no variable
referring to it.  The underlying GeoGebra :code:`Point` continues to
exist in the construction, but cannot be manipulated by any Python
code.
