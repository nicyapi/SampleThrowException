﻿using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;
using NullGuard;

namespace GitHub.UI
{
    [ValueConversion(typeof(bool), typeof(bool))]
    [Localizability(LocalizationCategory.NeverLocalize)]
    public class InverseBooleanConverter : ValueConverterMarkupExtension<InverseBooleanConverter>
    {
        public override object Convert(object value,
            Type targetType,
            [AllowNull]object parameter,
            [AllowNull]CultureInfo culture)
        {
            if (targetType != typeof(bool))
                throw new InvalidOperationException("The target must be a boolean");

            return !(bool)value;
        }

        public override object ConvertBack(object value, Type targetType,
            [AllowNull]object parameter,
            [AllowNull]CultureInfo culture)
        {
            if (targetType != typeof(bool))
                throw new InvalidOperationException("The target must be a boolean");

            return !(bool)value;
        }
    }
}
