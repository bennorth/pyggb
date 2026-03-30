Tangent function
================

.. py:function:: Tangent(point, conic)

   Construct a list of new (non-independent) GeoGebra lines which are
   the tangents to the given *conic* passing through the given
   *point*.  There can be zero, one, or two such tangents.  If you
   know that, for example, there will be exactly two tangents, you can
   use Python's destructuring assignment to assign to two variables:

   .. code-block:: python

      p = Point(15, 5)
      c = Ellipse(Point(4, -1), Point(-4, 1), 9)
      k1, k2 = Tangent(p, c)

.. py:function:: Tangent(line, conic)
   :noindex:

   Construct a list of new (non-independent) GeoGebra lines which are
   the tangents to the given *conic* parallel to the given *line*.
   There can be up to two such tangents.  If you know that, for
   example, there will be exactly two tangents, you can use Python's
   destructuring assignment to assign to two variables:

   .. code-block:: python

      k = Line(1/2, 5)
      c = Ellipse(Point(2, -1), Point(-2, 1), 3)
      k1, k2 = Tangent(k, c)

.. py:function:: Tangent(ellipse1, ellipse2)
   :noindex:

   Construct a list of new (non-independent) GeoGebra lines which are
   the common tangents to *ellipse1* and *ellipse2*, where "ellipse"
   can mean "circle".  There can be up to four such tangents.  If you
   know that, for example, there will be exactly four tangents, you
   can use Python's destructuring assignment to assign to four
   variables:

   .. code-block:: python

      c1 = Ellipse(Point(-3, -1), Point(-7, 1), 3)
      c2 = Ellipse(Point(4, -1), Point(8, 2), 7)
      k1, k2, k3, k4 = Tangent(c1, c2)

.. seealso::

   `GeoGebra Tangent() reference
   <https://geogebra.github.io/docs/manual/en/commands/Tangent/>`_
