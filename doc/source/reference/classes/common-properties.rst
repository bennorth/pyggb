Common properties
=================

Various object-types have some subset of the below properties.


.. py:property:: is_visible
   :type: bool

   |getSetProp| Whether the object is visible in the construction.


.. py:property:: is_independent
   :type: bool

   |getOnlyProp| Whether the object is independent — if the object
   depends on another GeoGebra object, then it is *not* independent.
   E.g., the code

   .. code-block:: python

      p1 = Point(3, 4)
      x = Number(-2)
      p2 = Point(x, 6)
      print("p1 indpt?", p1.is_independent)
      print("p2 indpt?", p2.is_independent)

   will print

   .. code-block:: text

      p1 indpt? True
      p2 indpt? False


.. py:property:: size

   |getSetProp| An integer from 1 (smallest) to 9 (biggest) giving the
   size of the object.


.. py:property:: color

   |getSetProp| A string describing the colour of the object.  Can be
   a named colour (from `this list
   <https://w3c.github.io/csswg-drafts/css-color/#named-colors>`_),
   e.g., :code:`"cornflowerblue"`, or a three- or six-hex-digit RGB
   code, e.g., :code:`"#8043a9"`.  When read, gives a six-hex-digit
   RGB code using uppercase letters for digits *A*–*F*.


.. py:property:: color_floats

   |getOnlyProp| A three-element tuple of floats, each in the range
   ``[0.0, 1.0]``, for the red, green, and blue components of the
   object's colour.


.. py:property:: line_thickness
   :type: int

   |getSetProp| How thick the line is, from 1 (thinnest) to 9
   (thickest).


.. py:property:: label_visible
   :type: bool

   |getSetProp| Whether the object's label is shown in the
   construction.


.. py:property:: label_style
   :type: int

   |getSetProp| What style of label to show for the object:

   * 0 — Name only
   * 1 — Name and value
   * 2 — Value only
   * 3 — Caption


.. py:property:: caption
   :type: string

   |getSetProp| The object's caption.  Note that setting the
   :py:attr:`caption` property also sets the :py:attr:`label_style`
   property to :code:`3`, to ensure the caption is shown.

.. py:property:: opacity

   |getSetProp| How opaque the object is, from 0 for totally
   transparent, to 1 for totally opaque.


Properties intended for internal use
------------------------------------

.. py:property:: _ggb_type
   :type: str

   |getOnlyProp| The GeoGebra "object type" for the object.  E.g.,
   :code:`point` for a Point.


.. py:property:: _ggb_exists
   :type: bool

   |getOnlyProp| Whether the underlying GeoGebra object referred to by
   this Python wrapper exists.

   .. caution::

      Currently, support for deleting GeoGebra objects is undocumented
      and experimental, so it is unlikely that your program will need
      to use the :py:attr:`_ggb_exists` property.
