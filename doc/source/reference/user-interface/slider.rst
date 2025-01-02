Slider
======

.. py:class:: Slider

   A :py:class:`Slider` can be used where a number is expected, for
   example as a coordinate for a :py:class:`Point`, or in a
   calculation with a :py:class:`Number`.

   .. py:method:: Slider(min_value, max_value, **kwargs)

      Create a new :py:class:`Slider` allowing values between the
      given *min_value* and the given *max_value*.  Keyword args can
      be:

      * increment — number, default 0.1
      * speed — number, default 1.0
      * width — number, default 100
      * isAngle — bool, default false
      * isHorizontal — bool, default true
      * isAnimating — bool, default false
      * isRandom — bool, default false

   .. py:property:: value

      |getSetProp| The current value of the :py:class:`Slider`.
      Getting *value* gives a Python :py:type:`float`.  If you try to
      set *value* outside the range given when constructing the
      :py:class:`Slider`, the value is clamped to the appropriate end
      of the range.

   A :py:class:`Slider` also has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`label_visible`
   * :py:attr:`label_style`
   * :py:attr:`caption`




.. seealso::

   `GeoGebra Slider() reference
   <https://geogebra.github.io/docs/manual/en/commands/Slider/>`_

