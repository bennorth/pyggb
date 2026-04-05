Boolean
=======

.. py:class:: Boolean

   A dynamic-valued true/false value.

   .. py:method:: Boolean(value: bool)

      Construct a new :py:class:`Boolean` with the given *value*.

   .. py:property:: value

      |getSetProp| The current value as a Python :py:type:`bool`.

   .. py:property:: latex
      :type: str

      |getOnlyProp| A string of LaTeX representing the current value
      of the Boolean (``"true"`` or ``"false"``).
